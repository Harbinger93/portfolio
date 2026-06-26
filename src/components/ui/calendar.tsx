import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-[var(--bg-secondary)]/30 backdrop-blur-md rounded-2xl border border-[var(--glass-border)]", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-between pt-1 relative items-center px-8",
        caption_label: "text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider",
        nav: "flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-55 hover:opacity-100 border-[var(--glass-border)] text-[var(--text-primary)] hover:bg-white/5 cursor-pointer rounded-lg"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex justify-center",
        head_cell:
          "text-[var(--text-secondary)]/70 rounded-md w-8 font-semibold text-[0.7rem] text-center uppercase tracking-wider py-1.5",
        row: "flex w-full mt-1.5 justify-center",
        cell: cn(
          "relative p-0 text-center text-xs focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-transparent",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-lg"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-white/5 text-[var(--text-primary)] rounded-lg text-xs"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-gradient-primary text-white hover:bg-gradient-primary hover:text-white focus:bg-gradient-primary focus:text-white rounded-lg shadow-[0_0_12px_rgba(0,242,254,0.3)] border border-white/20 font-bold",
        day_today: "bg-white/5 text-[var(--text-primary)] border border-white/10 rounded-lg font-bold",
        day_outside:
          "day-outside text-[var(--text-secondary)]/20 aria-selected:bg-[var(--accent-primary)]/50 aria-selected:text-white aria-selected:opacity-30",
        day_disabled: "text-[var(--text-secondary)]/20 opacity-30",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
