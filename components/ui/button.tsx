import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "secondary" | "ghost";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  default:
    "bg-gradient-to-r from-accent to-cyan-300 text-slate-950 shadow-[0_20px_40px_rgba(90,215,196,0.2)] hover:opacity-95",
  secondary: "border border-white/10 bg-white/[0.05] text-white hover:bg-white/[0.09]",
  ghost: "text-slate-200 hover:bg-white/[0.06]"
};

export function buttonVariants(variant: ButtonVariant = "default") {
  return cn(
    "inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-accent/60 disabled:pointer-events-none disabled:opacity-50",
    variants[variant]
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants(variant), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
