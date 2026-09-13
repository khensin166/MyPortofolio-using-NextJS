"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical, Settings2, X } from "lucide-react";
import type { FormStep, FormQuestion, FormOption } from "@/common/types/discovery-form";

interface VisualBuilderProps {
  schema: FormStep[];
  onChange: (newSchema: FormStep[]) => void;
}

const QUESTION_TYPES = [
  { value: "text", label: "Short Text" },
  { value: "textarea", label: "Long Text" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Phone Number" },
  { value: "radio-cards", label: "Radio Cards" },
  { value: "radio", label: "Radio Buttons" },
  { value: "select", label: "Dropdown" },
  { value: "slider", label: "Slider / Range" },
];

export default function VisualBuilder({ schema, onChange }: VisualBuilderProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(0);

  const updateStep = (stepIndex: number, field: keyof FormStep, value: any) => {
    const newSchema = [...schema];
    newSchema[stepIndex] = { ...newSchema[stepIndex], [field]: value };
    onChange(newSchema);
  };

  const addStep = () => {
    onChange([
      ...schema,
      {
        step: schema.length + 1,
        title: "New Step",
        subtitle: "",
        questions: [],
      }
    ]);
    setExpandedStep(schema.length);
  };

  const removeStep = (stepIndex: number) => {
    const newSchema = schema.filter((_, idx) => idx !== stepIndex);
    // Re-index steps
    newSchema.forEach((step, idx) => { step.step = idx + 1; });
    onChange(newSchema);
  };

  const addQuestion = (stepIndex: number) => {
    const newSchema = [...schema];
    newSchema[stepIndex].questions.push({
      id: `q_${Date.now()}`,
      type: "text",
      label: "New Question",
      required: false,
    });
    onChange(newSchema);
  };

  const updateQuestion = (stepIndex: number, qIndex: number, field: keyof FormQuestion, value: any) => {
    const newSchema = [...schema];
    newSchema[stepIndex].questions[qIndex] = { ...newSchema[stepIndex].questions[qIndex], [field]: value };
    onChange(newSchema);
  };

  const removeQuestion = (stepIndex: number, qIndex: number) => {
    const newSchema = [...schema];
    newSchema[stepIndex].questions = newSchema[stepIndex].questions.filter((_, idx) => idx !== qIndex);
    onChange(newSchema);
  };

  const addOption = (stepIndex: number, qIndex: number) => {
    const newSchema = [...schema];
    if (!newSchema[stepIndex].questions[qIndex].options) {
      newSchema[stepIndex].questions[qIndex].options = [];
    }
    newSchema[stepIndex].questions[qIndex].options!.push({
      label: "Option",
      value: `opt_${Date.now()}`
    });
    onChange(newSchema);
  };

  const updateOption = (stepIndex: number, qIndex: number, oIndex: number, field: keyof FormOption, value: any) => {
    const newSchema = [...schema];
    newSchema[stepIndex].questions[qIndex].options![oIndex] = {
      ...newSchema[stepIndex].questions[qIndex].options![oIndex],
      [field]: value
    };
    onChange(newSchema);
  };

  const removeOption = (stepIndex: number, qIndex: number, oIndex: number) => {
    const newSchema = [...schema];
    newSchema[stepIndex].questions[qIndex].options = newSchema[stepIndex].questions[qIndex].options!.filter((_, idx) => idx !== oIndex);
    onChange(newSchema);
  };

  return (
    <div className="space-y-6">
      {schema.map((step, stepIndex) => (
        <div key={stepIndex} className="rounded-xl border border-border bg-card overflow-hidden transition-all">
          {/* Step Header */}
          <div 
            className="flex items-center justify-between bg-secondary/30 px-5 py-4 cursor-pointer hover:bg-secondary/50"
            onClick={() => setExpandedStep(expandedStep === stepIndex ? null : stepIndex)}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                {step.step}
              </div>
              <div>
                <h3 className="font-medium text-foreground">{step.title || "Untitled Step"}</h3>
                <p className="text-xs text-muted-foreground">{step.questions.length} questions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); removeStep(stepIndex); }}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              {expandedStep === stepIndex ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
            </div>
          </div>

          {/* Step Content */}
          {expandedStep === stepIndex && (
            <div className="p-5 space-y-6 border-t border-border">
              {/* Step Settings */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 p-4 rounded-lg bg-background border border-border/50">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Step Title</label>
                  <input 
                    type="text" 
                    value={step.title} 
                    onChange={(e) => updateStep(stepIndex, "title", e.target.value)}
                    className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Subtitle (Optional)</label>
                  <input 
                    type="text" 
                    value={step.subtitle || ""} 
                    onChange={(e) => updateStep(stepIndex, "subtitle", e.target.value)}
                    className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary" 
                  />
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-primary" /> Questions
                </h4>
                
                {step.questions.length === 0 ? (
                  <div className="text-center py-6 text-sm text-muted-foreground border border-dashed border-border rounded-lg">
                    No questions added yet.
                  </div>
                ) : (
                  step.questions.map((q, qIndex) => (
                    <div key={qIndex} className="relative rounded-lg border border-border bg-background p-4 shadow-sm group">
                      <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => removeQuestion(stepIndex, qIndex)}
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-4 space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">Question ID</label>
                          <input 
                            type="text" 
                            value={q.id} 
                            onChange={(e) => updateQuestion(stepIndex, qIndex, "id", e.target.value)}
                            className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary font-mono text-xs" 
                          />
                        </div>
                        <div className="md:col-span-8 space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">Question Label</label>
                          <input 
                            type="text" 
                            value={q.label} 
                            onChange={(e) => updateQuestion(stepIndex, qIndex, "label", e.target.value)}
                            className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary" 
                          />
                        </div>
                        <div className="md:col-span-4 space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">Type</label>
                          <select 
                            value={q.type} 
                            onChange={(e) => updateQuestion(stepIndex, qIndex, "type", e.target.value as any)}
                            className="w-full rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm outline-none focus:border-primary"
                          >
                            {QUESTION_TYPES.map(type => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-6 space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">Placeholder (Optional)</label>
                          <input 
                            type="text" 
                            value={q.placeholder || ""} 
                            onChange={(e) => updateQuestion(stepIndex, qIndex, "placeholder", e.target.value)}
                            className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary" 
                          />
                        </div>
                        <div className="md:col-span-2 flex items-end pb-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={q.required || false}
                              onChange={(e) => updateQuestion(stepIndex, qIndex, "required", e.target.checked)}
                              className="rounded text-primary"
                            />
                            <span className="text-xs font-medium text-muted-foreground">Required</span>
                          </label>
                        </div>
                      </div>

                      {/* Options (If applicable) */}
                      {["radio-cards", "radio", "select"].includes(q.type) && (
                        <div className="mt-4 pt-4 border-t border-border/50">
                          <div className="flex items-center justify-between mb-3">
                            <label className="text-xs font-medium text-muted-foreground">Options</label>
                            <button 
                              onClick={() => addOption(stepIndex, qIndex)}
                              className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                              <Plus className="h-3 w-3" /> Add Option
                            </button>
                          </div>
                          
                          <div className="space-y-2">
                            {q.options?.map((opt, oIndex) => (
                              <div key={oIndex} className="flex flex-wrap items-center gap-2">
                                <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-move" />
                                <input 
                                  type="text" 
                                  value={opt.label} 
                                  onChange={(e) => updateOption(stepIndex, qIndex, oIndex, "label", e.target.value)}
                                  placeholder="Label"
                                  className="flex-1 min-w-[120px] rounded-lg border border-border bg-transparent px-3 py-1.5 text-sm outline-none focus:border-primary" 
                                />
                                <input 
                                  type="text" 
                                  value={opt.value} 
                                  onChange={(e) => updateOption(stepIndex, qIndex, oIndex, "value", e.target.value)}
                                  placeholder="Value"
                                  className="flex-1 min-w-[120px] rounded-lg border border-border bg-transparent px-3 py-1.5 text-sm outline-none focus:border-primary font-mono text-xs" 
                                />
                                {q.type === "radio-cards" && (
                                  <>
                                    <input 
                                      type="text" 
                                      value={opt.icon || ""} 
                                      onChange={(e) => updateOption(stepIndex, qIndex, oIndex, "icon", e.target.value)}
                                      placeholder="Icon (Emoji/Lucide)"
                                      className="w-32 rounded-lg border border-border bg-transparent px-3 py-1.5 text-sm outline-none focus:border-primary" 
                                    />
                                    <input 
                                      type="text" 
                                      value={opt.description || ""} 
                                      onChange={(e) => updateOption(stepIndex, qIndex, oIndex, "description", e.target.value)}
                                      placeholder="Description"
                                      className="flex-1 min-w-[150px] rounded-lg border border-border bg-transparent px-3 py-1.5 text-sm outline-none focus:border-primary" 
                                    />
                                  </>
                                )}
                                <button 
                                  onClick={() => removeOption(stepIndex, qIndex, oIndex)}
                                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
                
                <button 
                  onClick={() => addQuestion(stepIndex)}
                  className="w-full py-3 mt-2 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add Question to Step {step.step}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      
      <button 
        onClick={addStep}
        className="w-full py-4 border-2 border-dashed border-primary/30 rounded-xl text-primary font-medium hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="h-5 w-5" /> Add New Step
      </button>
    </div>
  );
}
