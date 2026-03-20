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
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-[44rem] space-y-2.5">
        <Badge variant="accent">{eyebrow}</Badge>
        <div className="space-y-1.5">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white md:text-5xl">{title}</h1>
          <p className="max-w-2xl text-sm text-slate-300 md:text-base">{description}</p>
        </div>
      </div>
      {aside}
    </div>
  );
}
