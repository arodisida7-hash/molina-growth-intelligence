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
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl space-y-3">
        <Badge variant="accent">{eyebrow}</Badge>
        <div className="space-y-2">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white md:text-[3.5rem]">{title}</h1>
          <p className="max-w-2xl text-base text-slate-300 md:text-lg">{description}</p>
        </div>
      </div>
      {aside}
    </div>
  );
}
