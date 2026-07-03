// @ts-nocheck
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
        month_caption: "flex justify-between pt-1 relative items-center px-8",
        caption_label: "text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider",
        nav: "flex items-center",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-55 hover:opacity-100 border-[var(--glass-border)] text-[var(--text-primary)] hover:bg-white/5 cursor-pointer rounded-lg absolute left-1 flex items-center justify-center"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-55 hover:opacity-100 border-[var(--glass-border)] text-[var(--text-primary)] hover:bg-white/5 cursor-pointer rounded-lg absolute right-1 flex items-center justify-center"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex justify-center",
        weekday:
          "text-[var(--text-secondary)]/70 rounded-md w-8 font-semibold text-[0.7rem] text-center uppercase tracking-wider py-1.5",
        week: "flex w-full mt-1.5 justify-center",
        day: cn(
          "relative p-0 text-center text-xs focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-transparent flex items-center justify-center"
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-white/5 text-[var(--text-primary)] rounded-lg text-xs flex items-center justify-center cursor-pointer"
        ),
        range_start: "day-range-start",
        range_end: "day-range-end",
        selected:
          "bg-gradient-primary text-white hover:bg-gradient-primary hover:text-white focus:bg-gradient-primary focus:text-white rounded-lg shadow-[0_0_12px_rgba(0,242,254,0.3)] border border-white/20 font-bold",
        today: "bg-white/5 text-[var(--text-primary)] border border-white/10 rounded-lg font-bold",
        outside:
          "day-outside text-[var(--text-secondary)]/20 aria-selected:bg-[var(--accent-primary)]/50 aria-selected:text-white aria-selected:opacity-30",
        disabled: "text-[var(--text-secondary)]/20 opacity-30",
        range_middle:
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

