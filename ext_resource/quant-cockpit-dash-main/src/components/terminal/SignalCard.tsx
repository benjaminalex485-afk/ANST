import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";

export type Signal = {
  symbol: string;
  action: "BUY" | "SELL" | "HOLD";
  confidence: number;
  strategy: string;
  regime: string;
  timestamp: string;
  reasoning: string;
};

export function SignalCard({ s }: { s: Signal }) {
  const tone =
    s.action === "BUY" ? "bull" : s.action === "SELL" ? "bear" : "neutral";

  return (
    <div className="border-b border-border px-2.5 py-2 hover:bg-panel-elevated">
      <div className="flex items-center gap-2">
        <StatusBadge variant={tone}>{s.action}</StatusBadge>
        <span className="font-mono text-[12px] font-semibold text-foreground">
          {s.symbol}
        </span>
        <span className="ml-auto font-mono text-[10px] text-muted-foreground">
          {s.timestamp}
        </span>
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <div className="flex-1">
          <div className="h-1 overflow-hidden rounded-sm bg-muted">
            <div
              className={cn(
                "h-full",
                tone === "bull"
                  ? "bg-bull"
                  : tone === "bear"
                    ? "bg-bear"
                    : "bg-info",
              )}
              style={{ width: `${s.confidence}%` }}
            />
          </div>
        </div>
        <span className="tnum font-mono text-[10px] text-muted-foreground">
          {s.confidence}%
        </span>
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
        <span className="rounded-sm border border-border px-1 py-0.5 text-foreground">
          {s.strategy}
        </span>
        <span className="rounded-sm border border-border px-1 py-0.5">
          regime: {s.regime}
        </span>
      </div>
      <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
        {s.reasoning}
      </p>
    </div>
  );
}
