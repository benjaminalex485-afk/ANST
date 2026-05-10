import { cn } from "@/lib/utils";

function Sparkline({ tone = "info" }: { tone?: "bull" | "bear" | "warn" | "info" }) {
  const stroke = {
    bull: "stroke-bull",
    bear: "stroke-bear",
    warn: "stroke-warn",
    info: "stroke-info",
  }[tone];
  // static path
  const d = "M0,14 L8,11 L16,12 L24,8 L32,10 L40,6 L48,9 L56,5 L64,7 L72,4";
  return (
    <svg viewBox="0 0 72 18" className="h-4 w-full" preserveAspectRatio="none">
      <path d={d} fill="none" strokeWidth="1.25" className={cn(stroke)} />
    </svg>
  );
}

export function SystemMetric({
  label,
  value,
  unit,
  tone = "info",
}: {
  label: string;
  value: string;
  unit?: string;
  tone?: "bull" | "bear" | "warn" | "info";
}) {
  return (
    <div className="flex flex-col gap-1 border border-border bg-panel px-2.5 py-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="tnum font-mono text-[14px] font-semibold text-foreground">
          {value}
        </span>
        {unit && (
          <span className="font-mono text-[10px] text-muted-foreground">{unit}</span>
        )}
      </div>
      <Sparkline tone={tone} />
    </div>
  );
}
