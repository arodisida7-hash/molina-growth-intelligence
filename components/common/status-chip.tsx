import { Badge } from "@/components/ui/badge";

export function StatusChip({ label }: { label: string }) {
  const variant =
    label.includes("Alta") || label.includes("Riesgo") || label.includes("Presion")
      ? "rose"
      : label.includes("Media") || label.includes("Watch")
        ? "amber"
        : label.includes("Escalar") || label.includes("Alta prioridad") || label.includes("Saludable")
          ? "accent"
          : "default";

  return <Badge variant={variant}>{label}</Badge>;
}
