import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/utils/cn";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { className, label, hint, error, leftIcon, rightSlot, id, ...rest },
  ref
) {
  const inputId = id || rest.name || Math.random().toString(36).slice(2);
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-xs font-medium tracking-wide text-ink-soft uppercase"
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          "flex items-center rounded-md border bg-white transition-colors",
          error ? "border-rose-soft" : "border-plum-100 focus-within:border-plum-400"
        )}
      >
        {leftIcon && <span className="pl-3 text-ink-mute">{leftIcon}</span>}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "flex-1 bg-transparent px-3 py-2.5 text-sm text-ink placeholder:text-ink-mute/60 focus:outline-none",
            className
          )}
          {...rest}
        />
        {rightSlot && <span className="pr-2">{rightSlot}</span>}
      </div>
      {hint && !error && <p className="mt-1 text-xs text-ink-mute">{hint}</p>}
      {error && <p className="mt-1 text-xs text-plum-700">{error}</p>}
    </div>
  );
});
