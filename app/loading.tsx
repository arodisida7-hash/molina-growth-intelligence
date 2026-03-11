import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <Card className="surface-highlight w-full max-w-4xl overflow-hidden border-white/10 bg-white/[0.04] p-8">
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <div className="h-3 w-32 rounded-full bg-white/10" />
            <div className="h-14 max-w-xl rounded-3xl bg-[length:200%_100%] bg-gradient-to-r from-white/[0.05] via-white/[0.14] to-white/[0.05] animate-shimmer" />
            <div className="space-y-3">
              <div className="h-4 rounded-full bg-white/10" />
              <div className="h-4 w-5/6 rounded-full bg-white/10" />
              <div className="h-4 w-2/3 rounded-full bg-white/10" />
            </div>
          </div>
          <div className="grid gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-24 rounded-3xl bg-white/[0.05]" />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
