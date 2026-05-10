import { createFileRoute } from "@tanstack/react-router";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { cn } from "@/lib/utils";

const lines = [
  { t: "10:42:11.842", lvl: "INFO", src: "execution", msg: "Order ord_8741a FILLED at 67820.00" },
  { t: "10:42:11.121", lvl: "INFO", src: "signal", msg: "BUY BTC/USDT confidence=0.82 strategy=MACD-XOver" },
  { t: "10:41:58.004", lvl: "WARN", src: "risk", msg: "Position size near soft cap (18% / 25%)" },
  { t: "10:41:42.661", lvl: "INFO", src: "ws", msg: "binance ws reconnect ok latency=12ms" },
  { t: "10:41:30.300", lvl: "ERROR", src: "feed", msg: "stale tick suppressed for SOL/USDT" },
  { t: "10:41:01.118", lvl: "INFO", src: "scheduler", msg: "tick t=60s drift=0.8ms" },
];

export const Route = createFileRoute("/_terminal/logs")({
  head: () => ({
    meta: [
      { title: "Logs — QUANT.OS Terminal" },
      { name: "description", content: "System and execution logs." },
    ],
  }),
  component: () => (
    <div className="h-full">
      <TerminalPanel title="Logs" subtitle="live tail" scroll>
        <div className="font-mono text-[11px]">
          {lines.map((l, i) => (
            <div key={i} className="flex gap-2 border-b border-grid-line px-2.5 py-1 hover:bg-panel-elevated">
              <span className="tnum w-28 text-muted-foreground">{l.t}</span>
              <span className={cn(
                "w-12 uppercase",
                l.lvl === "INFO" && "text-info",
                l.lvl === "WARN" && "text-warn",
                l.lvl === "ERROR" && "text-bear",
              )}>{l.lvl}</span>
              <span className="w-20 text-muted-foreground">[{l.src}]</span>
              <span className="text-foreground">{l.msg}</span>
            </div>
          ))}
        </div>
      </TerminalPanel>
    </div>
  ),
});
