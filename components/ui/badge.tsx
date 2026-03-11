import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "border-white/10 bg-white/[0.06] text-slate-100",
  accent: "border-accent/30 bg-accent/10 text-accent",
  amber: "border-amber-300/25 bg-amber-300/10 text-amber-200",
  rose: "border-rose-300/25 bg-rose-300/10 text-rose-200"
} as const;

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-[0.16em] uppercase",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}
