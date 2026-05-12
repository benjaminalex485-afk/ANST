import { cn } from "@/lib/utils";

export function RiskGauge({
  label,
  value,
  pct,
  tone = "info",
}: {
  label: string;
  value: string;
  pct: number;
  tone?: "bull" | "bear" | "warn" | "info";
}) {
  const toneBar = {
    bull: "bg-bull",
    bear: "bg-bear",
    warn: "bg-warn",
    info: "bg-info",
  }[tone];

  return (
    <div className="flex flex-col gap-1 px-2.5 py-1.5">
      <div className="flex items-center justify-between font-mono text-[10px]">
        <span className="uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="tnum text-foreground">{value}</span>
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-sm bg-muted">
        <div
          className={cn("h-full", toneBar)}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
        <div className="pointer-events-none absolute inset-y-0 left-[60%] w-px bg-warn/60" />
        <div className="pointer-events-none absolute inset-y-0 left-[85%] w-px bg-bear/60" />
      </div>
    </div>
  );
}
