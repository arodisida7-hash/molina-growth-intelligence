import { cn } from "@/lib/utils";

export function MiniBar({ value, tone = "accent", className }: { value: number; tone?: "accent" | "amber" | "rose"; className?: string }) {
  const color =
    tone === "accent"
      ? "from-accent to-cyan-300"
      : tone === "amber"
        ? "from-amber-300 to-orange-300"
        : "from-rose-300 to-pink-300";

  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-white/[0.08]", className)}>
      <div className={cn("h-full rounded-full bg-gradient-to-r", color)} style={{ width: `${Math.max(4, Math.min(100, value))}%` }} />
    </div>
  );
}
