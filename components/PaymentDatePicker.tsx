"use client";

import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentDatePickerProps {
  value: string; // ISO date string "YYYY-MM-DD"
  onChange: (value: string) => void;
  className?: string;
}

export default function PaymentDatePicker({
  value,
  onChange,
  className,
}: PaymentDatePickerProps) {
  // Get today's date as the minimum selectable date
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor="payment-date"
        className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider"
      >
        <CalendarDays className="h-4 w-4" />
        Payment Settlement Date
      </label>

      <div className="relative w-full sm:max-w-xs">
        <input
          id="payment-date"
          type="date"
          value={value}
          min={today}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full rounded-xl border-2 border-border/60 bg-card px-4 py-3 pr-10",
            "text-sm font-medium text-foreground cursor-pointer",
            "transition-all duration-200",
            "hover:border-primary/50",
            "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
            "dark:bg-card dark:text-foreground",
            "[color-scheme:light] dark:[color-scheme:dark]",
            value ? "text-foreground" : "text-muted-foreground"
          )}
        />
        <CalendarDays className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      {value && (
        <p className="text-xs text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-1">
          Settlement date:{" "}
          <span className="font-semibold text-primary">
            {new Date(value + "T12:00:00").toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </p>
      )}
    </div>
  );
}
