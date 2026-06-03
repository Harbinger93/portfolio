import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full min-h-32 px-4 py-3 rounded-xl bg-[var(--form-input-bg,rgba(255,255,255,0.06))] text-[var(--text-primary)] border border-[var(--form-input-border,rgba(255,255,255,0.12))] outline-none transition-all duration-300 placeholder:text-[var(--text-secondary)]/60 focus-visible:border-[var(--accent-primary)] focus-visible:ring-3 focus-visible:ring-[var(--accent-primary)]/10 disabled:opacity-50 disabled:cursor-not-allowed md:text-sm resize-none aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
