import { useState, type ChangeEvent } from "react";
import { cn } from "../../utils/cn";

export interface GooeyInputClassNames {
  root?: string;
  trigger?: string;
  input?: string;
}

export interface GooeyInputProps {
  placeholder?: string;
  className?: string;
  classNames?: GooeyInputClassNames;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

export function GooeyInput({
  placeholder = "Type to search...",
  className,
  classNames,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  disabled = false,
}: GooeyInputProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const searchText = valueProp !== undefined ? valueProp : uncontrolledValue;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (valueProp === undefined) {
      setUncontrolledValue(e.target.value);
    }
    onValueChange?.(e.target.value);
  };

  return (
    <div className={cn("relative flex items-center justify-center", className, classNames?.root)}>
      <input
        type="search"
        value={searchText}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          "h-10 w-full rounded-full border border-glass-border bg-[var(--bg-secondary)] px-4 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] transition-all",
          classNames?.input
        )}
      />
    </div>
  );
}
