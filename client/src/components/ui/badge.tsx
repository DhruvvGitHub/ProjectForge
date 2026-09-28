import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-blue-50 text-blue-700 border-blue-200",
    secondary: "bg-slate-100 text-slate-700 border-slate-200",
    outline: "border-slate-300 text-slate-700 bg-transparent",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
  }[variant]

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
        variantStyles,
        className
      )}
      {...props}
    />
  )
}

export { Badge }
