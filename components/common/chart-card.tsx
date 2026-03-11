import { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ChartCard({
  title,
  description,
  badge,
  children,
  className = ""
}: {
  title: string;
  description?: string;
  badge?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-2">
          <CardTitle>{title}</CardTitle>
          {description ? <p className="text-sm leading-6 text-slate-300">{description}</p> : null}
        </div>
        {badge ? <Badge variant="default">{badge}</Badge> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
