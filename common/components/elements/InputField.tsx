import {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

interface RadioInputProps<TFormValue extends FieldValues> {
  register: UseFormRegister<TFormValue>;
  name: Path<TFormValue>;
  error: FieldErrors;
  rule?: RegisterOptions<TFormValue, Path<TFormValue>>;
  isTextArea?: boolean;
  placeholder?: string;
  rows?: number;
}

const InputField = <TFormValue extends FieldValues>({
  name,
  rule,
  error,
  isTextArea = false,
  placeholder = "",
  rows = 2,
  register,
}: RadioInputProps<TFormValue>) => {
  const renderPlaceholder =
    placeholder || name.charAt(0).toUpperCase() + name.slice(1);
  return (
    <div className="w-full space-y-2">
      {isTextArea ? (
        <textarea
          rows={rows}
          placeholder={renderPlaceholder}
          {...register(name, rule)}
          className="w-full rounded-lg bg-secondary p-2 outline outline-border focus:outline-primary transition-all duration-300 placeholder:text-muted-foreground"
        ></textarea>
      ) : (
        <input
          type="text"
          placeholder={renderPlaceholder}
          {...register(name, rule)}
          className="w-full rounded-lg bg-secondary p-2 outline outline-border focus:outline-primary transition-all duration-300 placeholder:text-muted-foreground"
        />
      )}{" "}
      {error[name]?.type === "required" && (
        <p role="alert" className="text-[10px] text-red-400">
          *{name} is required
        </p>
      )}
      {error[name]?.type === "pattern" && (
        <p role="alert" className="text-[10px] text-red-400">
          *{String(error[name]?.message)}
        </p>
      )}
    </div>
  );
};

export default InputField;
