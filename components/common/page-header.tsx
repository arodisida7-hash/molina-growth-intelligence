import { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

export function PageHeader({
  eyebrow,
  title,
  description,
  aside
}: {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl space-y-4">
        <Badge variant="accent">{eyebrow}</Badge>
        <div className="space-y-3">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">{title}</h1>
          <p className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">{description}</p>
        </div>
      </div>
      {aside}
    </div>
  );
}
