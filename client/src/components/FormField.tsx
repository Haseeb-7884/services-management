import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  rightElement?: ReactNode;
  icon?: LucideIcon;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, rightElement, icon: Icon, id, className, ...inputProps }, ref) => {
    const fieldId = id ?? inputProps.name;

    return (
      <div>
        <label htmlFor={fieldId} className="mb-1.5 block text-xs font-medium text-[var(--brand-text-muted)]">
          {label}
        </label>
        <div className="relative">
          {Icon && (
            <Icon size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--brand-text-muted)]" />
          )}
          <input
            ref={ref}
            id={fieldId}
            className={`w-full rounded-lg border py-2.5 text-sm text-[var(--brand-text)] placeholder:text-[var(--brand-text-muted)]/60 outline-none transition ${
              Icon ? "pl-10" : "pl-3.5"
            } ${rightElement ? "pr-11" : "pr-3.5"} ${className ?? ""}`}
            style={{
              borderColor: error ? "#dc2626" : "var(--border-subtle)",
              backgroundColor: "var(--surface-card)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = error ? "#dc2626" : "var(--brand-primary)";
              inputProps.onFocus?.(e);
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = error ? "#dc2626" : "var(--border-subtle)";
              inputProps.onBlur?.(e);
            }}
            {...inputProps}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

FormField.displayName = "FormField";
